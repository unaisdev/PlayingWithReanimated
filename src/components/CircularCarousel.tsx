import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  Fragment,
} from 'react';
import {
  FlatList,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {CircularCarouselItem, ListItemWidth} from './CircularCarouselItem';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import AnimatedRn from 'react-native-reanimated';
import {Data, DataType} from '../data';

interface CircularCarouselProps {
  data: Data;
  preSelectedItemIndex: number | null;
  onBackdropPress: () => void;
  setSelectedItem: (item: DataType) => void;
  setPreSelectedItemIndex: (index: number) => void;
}

export interface CircularCarouselRef {
  expand: () => void;
  collapse: () => void;
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const listHeight = ListItemWidth * 2;

const Backdrop = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.backdrop}>
        {/* <View style={styles.backdropContent} pointerEvents="none">
          <Text style={styles.backdropTitle}>Selecciona tu oposición</Text>
        </View> */}
      </View>
    </TouchableWithoutFeedback>
  );
};

export const CircularCarousel = forwardRef<
  CircularCarouselRef,
  CircularCarouselProps
>(
  (
    {
      data,
      preSelectedItemIndex,
      onBackdropPress,
      setPreSelectedItemIndex,
      setSelectedItem,
    },
    ref,
  ) => {
    const flatListRef = useRef<FlatList>(null);
    const flatListTextRef = useRef<FlatList>(null);
    const opacity = useRef(new Animated.Value(0)).current;

    const contentOffset = useSharedValue(0);

    const [isVisible, setIsVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      expand: () => {
        setIsVisible(true);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      },
      collapse: () => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => setIsVisible(false));
      },
    }));

    console.log('preSelectedItemIndex', preSelectedItemIndex);

    const animatedTextStyle = useAnimatedStyle(() => {
      const opacityVal = interpolate(
        contentOffset.value % ListItemWidth,
        [0, ListItemWidth / 2, ListItemWidth],
        [1, 0.5, 1],
      );
      return {opacity: opacityVal};
    });

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;

      // Calculate the middle index based on the offset
      const middleIndex = Math.round(offsetX / ListItemWidth);

      // Only update if the index has changed
      if (middleIndex !== preSelectedItemIndex) {
        setPreSelectedItemIndex(middleIndex);

        if (middleIndex > data.length - 1) {
          return;
        }

        if (middleIndex < 0) {
          return;
        }

        flatListTextRef.current?.scrollToIndex({
          index: middleIndex,
          animated: true,
        });
      }

      // Update the shared value for animations
      contentOffset.value = offsetX;
    };

    return (
      <>
        {isVisible && (
          <>
            <Backdrop onPress={onBackdropPress} />
            <View style={StyleSheet.absoluteFill}>
              <FlatList
                ref={flatListTextRef}
                scrollEnabled={false}
                data={data}
                style={styles.textCarousel}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.textCarouselContent}
                horizontal
                renderItem={({item}) => {
                  return (
                    <AnimatedRn.View style={[styles.textContainer]}>
                      <Text style={[styles.text, animatedTextStyle]}>
                        {item.longName}
                      </Text>
                    </AnimatedRn.View>
                  );
                }}
                getItemLayout={(data, index) => ({
                  length: width,
                  offset: width * index,
                  index,
                })}
                onLayout={() => {
                  if (preSelectedItemIndex === null) {
                    return;
                  }

                  flatListTextRef.current?.scrollToOffset({
                    offset: preSelectedItemIndex * width,
                    animated: false,
                  });
                }}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                snapToInterval={width}
                decelerationRate="fast"
                snapToAlignment="start"
              />
              <FlatList
                ref={flatListRef}
                data={data}
                style={styles.carousel}
                contentContainerStyle={styles.carouselContent}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => (
                  <CircularCarouselItem
                    closeCarousel={onBackdropPress}
                    preSelectedItemIndex={preSelectedItemIndex}
                    index={index}
                    flatListRef={flatListRef}
                    contentOffset={contentOffset}
                    item={item}
                    setSelectedItem={setSelectedItem}
                  />
                )}
                horizontal
                removeClippedSubviews={false}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onLayout={() => {
                  if (preSelectedItemIndex === null) {
                    return;
                  }

                  flatListRef.current?.scrollToOffset({
                    offset: preSelectedItemIndex * ListItemWidth,
                    animated: false,
                  });
                }}
                onScroll={onScroll}
                overScrollMode="never"
                snapToInterval={ListItemWidth}
                decelerationRate="fast"
                snapToAlignment="start"
              />
            </View>
          </>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    width: width,
    fontSize: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCarousel: {
    // position: 'absolute',
    // bottom: listHeight / 1.2,
  },
  textCarouselContent: {
    justifyContent: 'center',
  },
  carousel: {
    position: 'absolute',
    bottom: 24,
    height: listHeight,
  },
  carouselContent: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 3 * ListItemWidth,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    opacity: 0.9,
  },
  backdropContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    height: height - listHeight,

    zIndex: 1,
  },
  backdropTitle: {
    fontSize: 18,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 12,
    padding: 12,
  },
});
