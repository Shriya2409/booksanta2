import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       allDonations : []
     }
     this.requestRef= null
   }


   getAllDonations =()=>{
     this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
       var allDonations = snapshot.docs.map(document => document.data());
       this.setState({
         allDonations : allDonations,
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.book_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity style={styles.button}
           onPress={()=>{
             this.sendBook(item)
           }}>

             <Text style={{color:'#ffff'}}>Send Book</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getAllDonations()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   sendNotification=(book_details, request_status)=>{
var requestId=bookDetails.request_id;
var donorId=bookDetails.donor_id;
db.collection("all_notifications").where("request_id","==","requestId").where("donor_id","==","donorId").get()
.then((snapshot)=>{
  snapshot.forEach((doc)=>{
    var message=""
    if (request_status === "bookSent" ){
      message=this.state.donorName+"sent you books"
    }else{
      message=this.state.donorName+"has shown interest in donating the book"
    }
    db.collection("all_notifications").doc(doc.id).update({
      "message":message,
      "notification_status":"unread",
      "date":firebase.firestore.FieldValue.serverTimestamp(),
    })
  })
})
   }

   sendBook=(book_details)=>{
if (book_details.request_status==="bookSent"){
  var requestStatus="donorInterested";
  db.collection("all_donations").doc(book_details.doc_id).update({
    "request_status":"donorInterested"
  })

  this.sendNotification(book_details, requestStatus)
}else {
  var requestStatus="bookSent"
  db.collection("all_donations").doc(book_details.doc_id).update({
    "request_status":"bookSent"

  })
  this.sendNotification(book_details, requestStatus)
}
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Donations"/>
         <View style={{flex:1}}>
           {
             this.state.allDonations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all book Donations</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allDonations}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})