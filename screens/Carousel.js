import {
	FlatList,
	Image,
	StyleSheet,
	View,
	Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

const Carousel = () => {
	const flatlistRef = useRef();
	// Get Dimensions
	const screenWidth = Dimensions.get("window").width;
	const [activeIndex, setActiveIndex] = useState(0);

	// Data for carousel
	const carouselData = [
		{
			id: "01",
			image: require("../assets/images/slider_1.jpg"),
		},
		{
			id: "02",
			image: require("../assets/images/slider_2.jpg"),
		},
		{
			id: "03",
			image: require("../assets/images/slider_3.jpg"),
		},
	];

	// Auto Scroll
	useEffect(() => {
		const interval = setInterval(() => {
			if (carouselData.length > 0) {
				const nextIndex = (activeIndex + 1) % carouselData.length;
				flatlistRef.current.scrollToIndex({
					index: nextIndex,
					animated: true,
				});
				setActiveIndex(nextIndex);
			}
		}, 5000); // Change the interval to 5000 milliseconds (5 seconds)

		return () => clearInterval(interval);
	}, [activeIndex, carouselData.length]);

	const getItemLayout = (data, index) => ({
		length: screenWidth,
		offset: screenWidth * index,
		index,
	});

	// Display Images // UI
	const renderItem = ({ item }) => {
		return (
			<View style={styles.itemContainer}>
				<Image
					source={item.image}
					style={styles.image}
				/>
			</View>
		);
	};

	// Handle Scroll
	const handleScroll = (event) => {
		const scrollPosition = event.nativeEvent.contentOffset.x;
		const index = Math.floor(scrollPosition / screenWidth);
		setActiveIndex(index);
	};

	// Render Dot Indicators
	const renderDotIndicators = () => {
		return carouselData.map((_, index) => {
			const isActive = activeIndex === index;
			return (
				<View
					key={index}
				/>
			);
		});
	};

	return (
		<View>
			<FlatList
				data={carouselData}
				ref={flatlistRef}
				getItemLayout={getItemLayout}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				horizontal={true}
				pagingEnabled={true}
				onScroll={handleScroll}
			/>

			<View style={styles.dotsContainer}>
				{renderDotIndicators()}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	itemContainer: {
		width: Dimensions.get("window").width,
	},
	image: {
		height: 200,
		width: '100%',
	},
	dotsContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 30,
	},
});

export default Carousel;
