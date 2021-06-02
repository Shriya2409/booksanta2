import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import BookDonateScreen from '../screens/BookDonateScreen';
import {createStackNavigator} from 'react-navigation-stack';
import RecieverDetailsScreen from '../screens/RecieverDetailsScreen';

export const AppStackNavigator = createStackNavigator({
    BookDonateList : {
      screen : BookDonateScreen,
      navigationOptions:{
          headerShown:false
      }
      },
      RecieverDetails : {
        screen : RecieverDetailsScreen,
        navigationOptions:{
            headerShown:false
        }
      }
    },
    {
      initialRouteName : 'BookDonateList'
    })