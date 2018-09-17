module.exports = {
    lerp: function(ratio, start, end) {
        return start + (end - start) * ratio;
    },
    /**
     * Maps 2 numbers, to two other numbers using val as a ratio
     * @param {number} val
     * @param {number} min1
     * @param {number} max1
     * @param {number} min2
     * @param {number} max2
     * @returns {number}
     */
    map: function ( val, min1, max1, min2, max2 ) {
        return this.lerp(this.norm( val, min1, max1 ), min2, max2 );
    },
    /**
     * Same as map, but clamp's the numbers within the range
     * @param {number} val
     * @param {number} min1
     * @param {number} max1
     * @param {number} min2
     * @param {number} max2
     * @returns {number}
     */
    mapClamp: function ( val, min1, max1, min2, max2 ) {
        var val = this.lerp(this.norm( val, min1, max1 ), min2, max2 );
        return Math.max(min2, Math.min(max2, val));
    },
    /**
     * Normalized a set of three numbers
     * @param {number} val
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    norm: function ( val, min, max ) {
        return (val - min) / (max - min);
    }
}
