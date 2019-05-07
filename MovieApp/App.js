/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { SearchBar } from 'react-native-elements';
import { Platform, StyleSheet, View, ScrollView } from 'react-native';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';

import {firebaseConfig, API_KEY, API_URL} from './config';

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// URL constants


// Default placeholder picture
const DEFAULT_PIC_URL = "https://www.pexels.com/photo/brown-rocky-mountain-photography-2098427/";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const fireBase = firebase.initializeApp(firebaseConfig);
console.log("siin");
type Props = {};
export default class App extends Component<Props> {
  state = {
    movies: [],
    searchString: '',
    movieDetails: [],
    detailsVisible: false
  }

  favorite(movie) {
    var ref = fireBase.database().ref("movies/" + movie + '/favorite');
    ref.once("value")
    .then(function(snapshot) {
      snapshot.val() ? ref.set(false) : ref.set(true)
    });
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
       console.log(retrievedMovies);
       this.setState({ movies: retrievedMovies });
     })
     .catch(err => console.log(err));
  }


  handleMovieTitleChange = search => {
    this.setState({ searchString: search })
    this.fetchMovies(search);
  }

  handleTitleClick = movieId => {
    fetch(API_URL + "?i=" + movieId + "&apiKey=" + API_KEY)
      .then(res => res.json())
      .then(movieDetails => {
        if(movieDetails) {
          // Put into state, or directly pass them to the component
          let movieInfo = [];
          
          for( let i = 0; i < movieDetails.length; i++) {
            movieInfo.push({
              title: movieDetails['Title'],
              year: movieDetails['Year'],
              released: movieDetails['Released'],
              runtime: movieDetails['Runtime']
              // And so on
            })
          }
          this.setState({
            detailsVisible: true,
            movieDetails: movieInfo
          });
        } else {
          this.setState({ detailsVisible: false });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <View>
        <ScrollView>
          <SearchBar 
            platform="android"
            placeholder="Search"
            onChangeText={this.handleMovieTitleChange}
            value={this.state.searchString}
          />
          <MovieList 
            movies={this.state.movies}
            handleDetailsRetrieval={this.handleTitleClick}
          />
          <ScrollView>
            <MovieDetails details={this.state.movieDetails} /> 
          </ScrollView>
        </ScrollView>
        
      </View>
    );
  }
}

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
