import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert} from 'react-native';
import { ListItem } from 'react-native-elements'
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import {SwipeListView} from 'react-native-swipe-list-view';

export default class SwipeOurFlatlist extends Component{

    constructor(props){
        super(props);
        this.state ={
          all_notifications:this.props.all_notifications
        }
      }

      updateMarkAsRead=notification=>{
          db.collection("all_notifications").doc(notification.doc_id).update({
              notification_status:"read"
          })
      }

      renderItem=data=>{
        <ListItem
        title={data.item.book_name}
        subtitle={data.item.message}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        leftElement={<Icon name="book" type="font-awsome" color="blue"/>}
        bottomDivider
      />
      }

      renderHiddenItem=()=>{
          <View>
              <View>
                  <Text style={{color: "#FFF", fontWeight: "bold", fontSize: 15, textAlign: "center", alignSelf: "flex-start"}}> mark as read </Text>
              </View>
          </View>
      }

    onSwipeValueChange=swipeData=>{
        var allNotifications=this.state.all_notifications
        const {key,value} = swipeData
        if (value<-Dimensions.get("window").width){
            const newData=[...allNotifications]
            this.updateMarkAsRead(allNotifications[key])
            newData.splice(key,1)
            this.setState({allNotifications:newData})
        }
    }

    render(){
        return(
            <View>
                <SwipeListView 
                disableRightSwipe
                data={this.state.all_notifications}
                renderItem={this.renderItem}
                renderHiddenItem={this.renderHiddenItem}
                rightOpenValue={-Dimensions.get("window").width}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onSwipeValueChange={this.onSwipeValueChange}
                keyExtractor={(item,index)=>index.toString}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
  })