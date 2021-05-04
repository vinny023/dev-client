import React, { useCallback } from 'react'
import { View, Text } from 'react-native'

// import RangeSlider from 'rn-range-slider';
import Rail from './Rail';
import Thumb from './Thumb';
import RailSelected from './RailSelected';


const renderThumb = useCallback(() => <Thumb/>, []);
const renderRail = useCallback(() => <Rail/>, []);
const renderRailSelected = useCallback(() => <RailSelected/>, []);
//const renderLabel = useCallback(value => <Label text={value}/>, []);
//const renderNotch = useCallback(() => <Notch/>, []);
// const handleValueChange = useCallback((low, high) => {
//   setLow(low);
//   setHigh(high);
// }, []);
export default function CustomSlider() {
    return (
        <View>
            {/* <RangeSlider
                //style={styles.slider}
                min={0}
                max={100}
                step={1}
                floatingLabel
                renderThumb={renderThumb}
                renderRail={renderRail}
                renderRailSelected={renderRailSelected}
               // renderLabel={renderLabel}
               // renderNotch={renderNotch}
                //onValueChanged={handleValueChange}
            /> */}

        </View>
    )
}
