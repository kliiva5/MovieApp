import React from 'react';
import { FlatList, View, Text } from 'react-native';

const movieList = props => {
    return (
        <FlatList 
            data={props.movies}
            keyExtractor={movie => movie.id}
            renderItem={movie => (
                <Text>{movie.title}</Text>
            )}
        />
    );
}

export default movieList;