import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'
import SwipeOurFlatlist from '../components/SwipeOurFlatlist';

export default class NotificationScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotifications:[]

        }
    }

getNotifications=()=>{
    this.requestRef=db.collection("all_Notifications")
    .where("notification_Status","===","unread")
    .where("targeted_user_id", "===", this.state.userId)
    .onSnapshot((snapshot)=>{
        var allNotifications=[]
        snapshot.docs.map((doc)=>{
            var notification=doc.data()
            notificatiion["doc_id"]=doc.id
            allNotifications.push(notification)
        })
        this.setState({
            allNotifications:allNotifications
        })
    })
}

componentDidMount=()=>{
    this.getNotifications()
}

keyExtractor = (item, index) => index.toString()
renderItem = ( {item, index} ) =>{
    return(
    <ListItem
      key={index}
      title={item.book_name}
      leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      subtitle={item.message}
         
      bottomDivider 
    /> )
    }

    render(){
        return(
            <View>
          <View style={{flex:1}}>
            <MyHeader navigation={this.props.navigation} title="My Notifications"/>
            </View>

            <View style={{flex:0.9}}>
{this.state.allNotifications.length===0
?(
    <View>
        <Text>you have no notifictions</Text>
    </View>
)
:(
    <SwipeOurFlatlist allNotifications={this.state.all_notifications}/>
)}

            </View>
            </View>
        )
      }
}