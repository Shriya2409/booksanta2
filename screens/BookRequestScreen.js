import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      isBookRequestActive:"",
      book_status:"",
      userDocId:""
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }




  addRequest =(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        book_status : "requested",
        "date" : firebase.firestore.FieldValue.serverTimestamp()
    })
 this.getBookRequest()
db.collection('users').where("email_id", "==", userId).get()
.then ()
.then((snapshot)=>{
  snapshot.forEach((doc)=>{
    db.collection('users').doc(doc.id).update({
      isBookRequestActive : true
    })
  })
})
    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }

  getBookRequest=async()=>{
    var bookRequest=db.collection('requested_books')
    .where('user_id', "==", this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if (doc.data().book_status!=="recieved"){
          this.setState({
            request_id:doc.data().request_id,
            requestedBookName:doc.data().book_name,
            book_status:doc.data().book_status,
            docId:doc.id
          })
        }
      })
    })
  }
  

  getIsBookRequestActive(){
    db.collection('users').where("email_id", "==", this.state.userId).onSnapshot(querySnapshot=>{
      querySnapshot.forEach(doc=>{
        this.setState({
          isBookRequestActive:doc.data().isBookRequestActive,
          userDocId:doc.id
        })
      })
    })
  }

  sendNotification=()=>{ //to get the first name and last name
     db.collection('users').where('email_id','==',this.state.userId).get() 
     .then((snapshot)=>{ 
       snapshot.forEach((doc)=>{ 
         var name = doc.data().first_name 
        var lastName = doc.data().last_name 
        // to get the donor id and book nam 
        db.collection('all_notifications').where('request_id','==',this.state.requestId).get() 
        .then((snapshot)=>{ 
          snapshot.forEach((doc) => { 
            var donorId = doc.data().donor_id 
            var bookName = doc.data().book_name 
            //targert user id is the donor id to send notification to the user 
            db.collection('all_notifications').add({ "targeted_user_id" : donorId, "message" : name +" " + lastName + " received the book " + bookName , "notification_status" : "unread", "book_name" : bookName }) 
          }) 
        }) 
      }) 
    }) 
  }

  updateBookRequestStatus=()=>{
    db.collection('requested_books').doc(this.state.docId)
    .update({
      book_status:"recieved"
    })
    db.collection('users').where('email_id','==',this.state.userId).get() 
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{ 
        db.collection('users').doc(doc.id).update({
          isBookRequestActive:false
        })
      })
     })
  }


  recievedTheBooks=(bookname)=>{
var userid=this.state.userId
var requestid=this.state.requestId
db.collection('recieved_books').add({
  "userId":userId,
  "requestId":requestId,
  "bookName":bookName,
  "bookStatus":"recieved"
})
  }

  render(){
    if(this.state.isBookRequestActive===true){
      return(
        <View>
          <View>
            <Text>book name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View>
            <Text>bookStatus</Text>
            <Text>{this.state.book_status}</Text>
          </View>
          <TouchableOpacity onPress={()=>{
            this.sendNotification()
            this.updateBookRequestStatus()
            this.recievedTheBooks(this.state.requestedBookName)
          }}>
            <Text>I recieved the book</Text>
          </TouchableOpacity>
        </View>
      )
    }else{
    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
      
    )
              }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)