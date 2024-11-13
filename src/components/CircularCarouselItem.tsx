import React from 'react';
import {StyleSheet, Dimensions, TouchableOpacity, FlatList} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  SlideInDown,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {DataType} from '../data';
import {Icon} from 'lucide-react-native';

interface CircularCarouselItemProps {
  flatListRef: React.RefObject<FlatList>;
  contentOffset: SharedValue<number>;
  item: DataType;
  index: number;
  preSelectedItemIndex: number | null;
  setSelectedItem: (item: DataType) => void;
  closeCarousel: () => void;
}

const windowWidth = Dimensions.get('window').width;

const mainDividend = 4;

export const ListItemWidth = windowWidth / mainDividend;

export const CircularCarouselItem = ({
  flatListRef,
  item,
  contentOffset,
  index,
  preSelectedItemIndex,
  setSelectedItem,
  closeCarousel,
}: CircularCarouselItemProps) => {
  const rStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 5) * ListItemWidth * 100,
      (index - 3) * ListItemWidth,
      (index - 1) * ListItemWidth,
      index * ListItemWidth,
      (index + 1) * ListItemWidth,
      (index + 3) * ListItemWidth,
      (index + 5) * ListItemWidth * 100,
    ];

    const outputRange = [
      0,
      -ListItemWidth / 20,
      -ListItemWidth / 20,
      -ListItemWidth / 1.8,
      -ListItemWidth / 20,
      -ListItemWidth / 20,
      0,
    ];

    const translateY = interpolate(
      contentOffset.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP,
    );

    return {
      transform: [
        {
          translateY,
        },
        {
          translateX: ListItemWidth / 2 + ListItemWidth,
        },
      ],
    };
  });

  const scrollToIndex = () => {
    flatListRef.current?.scrollToOffset({
      offset: index * ListItemWidth,
      animated: true,
    });
  };

  const handleSelectItem = () => {
    scrollToIndex();
    setSelectedItem(item);
    closeCarousel();
  };
  // Animated style for opacity based on scroll
  const opacityStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 5) * ListItemWidth,
      (index - 2) * ListItemWidth,
      (index - 1) * ListItemWidth,
      index * ListItemWidth,
      (index + 1) * ListItemWidth,
      (index + 2) * ListItemWidth,
      (index + 5) * ListItemWidth,
    ];

    const outputRange = [0, 0.1, 0.3, 1, 0.3, 0.1, 0];

    // Calculate the opacity for this item
    const opacity = interpolate(
      contentOffset.value,
      inputRange,
      outputRange,
      Extrapolation.CLAMP,
    );

    return {
      opacity, // Set the interpolated opacity
    };
  });

  const shadowStyle =
    preSelectedItemIndex === index
      ? {
          shadowColor: 'white',
          shadowOffset: {width: 0, height: 20},
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 6,
        }
      : {};

  return (
    <Animated.View
      entering={SlideInDown.duration(300)}
      style={[styles.carouselItem, shadowStyle, rStyle, opacityStyle]}>
      <TouchableOpacity
        onPress={handleSelectItem}
        style={[styles.circle, {backgroundColor: item.color}]}>
        {/* <Text style={styles.title}>{item.name}</Text> */}
        <Icon width={32} height={32} iconNode={item.icon} color={'black'} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    padding: 4,
    width: ListItemWidth,
    aspectRatio: 1,
    justifyContent: 'center',
  },
  circle: {
    aspectRatio: 1,
    borderRadius: 400,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    borderColor: 'gray',
    fontWeight: 'bold',
  },
  preSelectedText: {
    marginTop: 12,
    fontSize: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    fontWeight: 'bold',
  },
});
