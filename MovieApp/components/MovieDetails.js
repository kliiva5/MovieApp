import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';

const MovieDetails = props => {
    return (
        props.details.map((data, i) =>
             <View>
                <ListItem 
                    key={i}
                    title={details.title}
                    year={details.year}
                />
                <Text>text</Text>
            </View>
        )
    );
}

export default MovieDetails;