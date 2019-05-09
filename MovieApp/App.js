/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { SearchBar, ListItem, Card } from 'react-native-elements';
import { Platform, StyleSheet, View, ScrollView, Text, Button } from 'react-native';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions } from 'react-navigation'

import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';

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
  state = {
    movies: [],
    search: "",
  }
  
  handleDetailsRetrieval = movieId => {
    fetch(API_URL + "?i=" + movieId + "&apiKey=" + API_KEY)
      .then(res => res.json())
      .then(movieDetails => {
        this.props.navigation.navigate('Details', {
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
    fetch(API_URL + "?s=" + title + "&type=&apikey=" + API_KEY)
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
  render() {
    const { navigation } = this.props;
    const movieTitle = navigation.getParam('title');
    const movieYear = navigation.getParam('year');
    const movieRunTime = navigation.getParam('runtime');
    const moviePlot = navigation.getParam('plot');
    const moviePoster = navigation.getParam('poster');

    return (
      <Card
        title={movieTitle + " " + "(" + movieYear + ")"}
        image={{ uri: moviePoster }}>
        <Text style={{marginBottom: 10}}>
          { moviePlot }
        </Text>
      </Card>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Search: SearchScreen,
    Details: MovieDetailsScreen
  }, 
  {
    initialRouteName: 'Search'
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

export default createAppContainer(AppNavigator);