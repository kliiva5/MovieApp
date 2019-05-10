/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { SearchBar, ListItem, Card, Icon } from 'react-native-elements';
import { Platform, StyleSheet, View, ScrollView, Text, Button } from 'react-native';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions, createBottomTabNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons';

import {firebaseConfig, API_KEY, API_URL} from './config';

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// Default placeholder picture
const DEFAULT_PIC_URL = "https://www.pexels.com/photo/brown-rocky-mountain-photography-2098427/";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const fireBase = firebase.initializeApp(firebaseConfig);
class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'Movie Search',
  };

  state = {
    movies: [],
    search: "",
  }
  
  handleDetailsRetrieval = movieId => {
    fetch(API_URL + "?i=" + movieId + "&apiKey=" + API_KEY)
      .then(res => res.json())
      .then(movieDetails => {
        this.props.navigation.navigate('Details', {
          id: movieDetails.imdbID,
          title: movieDetails.Title,
          year: movieDetails.Year,
          runtime: movieDetails.Runtime,
          plot: movieDetails.Plot,
          poster: movieDetails.Poster === 'N/A' ? DEFAULT_PIC_URL : movieDetails.Poster
        })
      })
      .catch(err => console.log(err));
  }

  fetchMovies = title => {
    fetch(API_URL + "?s=" + title + "&type=movie&apikey=" + API_KEY)
     .then(res => res.json())
     .then(moviesJson => {
       let searchResults = moviesJson['Search'];
       let retrievedMovies = [];
       if( searchResults !== 'undefined' && searchResults ) {
         for(let i = 0; i < searchResults.length; i++) {
          retrievedMovies.push({
             id: searchResults[i].imdbID,
             title: searchResults[i].Title,
             releaseYear: searchResults[i].Year,
             icon: searchResults[i].Poster === 'N/A' ? DEFAULT_PIC_URL : searchResults[i].Poster
           })
         }
       }
       this.setState({ movies: retrievedMovies });
     })
     .catch(err => console.log(err));
  }

  updateSearch = search => {
    this.setState({ search });
    this.fetchMovies(search);
  }

  render() {
    return (
      <ScrollView>
        <SearchBar 
          placeholder="Search for movies..."
          platform="android"
          onChangeText={this.updateSearch}
          value={this.state.search}
        />
        {
          this.state.movies.map((movie, i) =>
            <ListItem 
                key={i}
                title={movie.title}
                subtitle={movie.releaseYear}
                leftAvatar={{
                    source: { uri: movie.icon }
                }}
                onPress={() => this.handleDetailsRetrieval(movie.id)}
            />
          )
        }
      </ScrollView>
    );
  }
}

class MovieDetailsScreen extends React.Component {
  static navigationOptions = {
    title: 'Movie Details',
  };
  
  constructor() {
    super()
    this.isFav = this.isFav.bind(this)
  }

  state = {
    fav: false,
  }
  
  favourite(id) {
    var ref = fireBase.database().ref("movies/" + id + '/favourite');
    ref.once("value")
    .then(function(snapshot) {
      snapshot.val() ? ref.set(false) : ref.set(true)
    });
 
    this.isFav(id);

    var movie = fireBase.database().ref("movies/" + id);
    const { navigation } = this.props;
    const movieTitle = navigation.getParam('title');
    const movieYear = navigation.getParam('year');
    const moviePoster = navigation.getParam('poster');
    
    movie.set(({
      favourite: this.state.fav,
      title: movieTitle,
      year: movieYear,
      poster: moviePoster
    }));
  }

  isFav(id) {
    let movieFav = true;
    var isFav = firebase.database().ref('movies/' + id + '/favourite');
    isFav.on('value', function(snapshot) {
      movieFav = snapshot.val();
    });
    this.setState({fav: movieFav});
  }



  render() {
    const { navigation } = this.props;
    const movieId = navigation.getParam('id');
    const movieTitle = navigation.getParam('title');
    const movieYear = navigation.getParam('year');
    const movieRunTime = navigation.getParam('runtime');
    const moviePlot = navigation.getParam('plot');
    const moviePoster = navigation.getParam('poster');

    return (
      <ScrollView>
        <Card
          title={ movieTitle + " " + "(" + movieYear + ")" }
          image={{ uri: moviePoster }}>
          <Text style={{marginBottom: 10, fontSize: 16}}>
            { moviePlot }
          </Text>
          <Text style={{ marginBottom: 10, fontSize: 16 }}>
            Runtime: { movieRunTime }
          </Text>
          <Icon
            raised
            name={this.state.fav ? "star" : "star-border"}
            type='material'
            color='#f50'
            containerStyle={{ flexDirection: 'row-reverse' }}
            onPress={() => this.favourite(movieId)}/>
        </Card>
      </ScrollView>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Search: SearchScreen,
    Details: MovieDetailsScreen
  }, 
  {
    initialRouteName: 'Search',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#008ad3',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});

export default createAppContainer(createBottomTabNavigator(
  {
    Search: AppNavigator,
    Favourites: AppNavigator, //still needs FavMovies not MovieDetailsScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor}) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Search'){
          iconName = `ios-search`;
        } else if (routeName === 'Favourites') {
          iconName = 'ios-star';
        }

        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'blue',
      inactiveTintColor: 'gray',
    },

  }
));