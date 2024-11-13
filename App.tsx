/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  CircularCarousel,
  CircularCarouselRef,
} from './src/components/CircularCarousel';
import {data, DataType} from './src/data';

function App(): React.JSX.Element {
  const carouselRef = useRef<CircularCarouselRef | null>(null);
  const [selectedItem, setSelectedItem] = useState<DataType | null>(null);
  const [preSelectedItemIndex, setPreSelectedItemIndex] = useState<number>(0);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleClose = () => {
    console.log('handleClose');
    carouselRef.current?.collapse();
  };

  const handleOpen = () => {
    console.log('handleOpen');
    carouselRef.current?.expand();
  };
  console.log('render');
  return (
    <SafeAreaView style={[{flex: 1}, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {selectedItem && <Text>Selected Item: {selectedItem.id}</Text>}
      {preSelectedItemIndex >= 0 && (
        <Text>PRE Selected Item: {preSelectedItemIndex}</Text>
      )}

      <Button title="Open Carousel" onPress={handleOpen} />

      <CircularCarousel
        preSelectedItemIndex={preSelectedItemIndex}
        ref={carouselRef}
        setPreSelectedItemIndex={item => {
          setPreSelectedItemIndex(item);
        }}
        onBackdropPress={handleClose}
        setSelectedItem={item => {
          setSelectedItem(item);
        }}
        data={data}
      />
    </SafeAreaView>
  );
}

export default App;
