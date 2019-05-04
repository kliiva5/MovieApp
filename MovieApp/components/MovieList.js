import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';


const movieList = props => {
    return (
        props.movies.map((movie, i) =>
            <ListItem 
                key={i}
                title={movie.title}
                subtitle={movie.releaseYear}
                leftAvatar={{
                    source: { uri: movie.icon }
                }}
                onPress={() => props.handleDetailsRetrieval(movie.id)}
            />
        )
    );
}

export default movieList;