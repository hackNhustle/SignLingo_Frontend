// Authentic ASL Alphabet G-Z
// Real hand shapes based on American Sign Language

export const G = (ref) => {
    let animations = [];
    // Index and middle fingers make a gun shape - pointing forward
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/10, "-"]);
    // Other fingers closed
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    // Thumb out to side
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", Math.PI/3, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);
};

export const H = (ref) => {
    let animations = [];
    // Index and middle fingers up - like peace sign but palm down
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/10, "-"]);
    // Other fingers closed
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    // Thumb closed
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    // Palm facing down
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/3, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    ref.animations.push(animations);
};

export const I = (ref) => {
    let animations = [];
    // Only pinky finger extended
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", -Math.PI/12, "-"]);
    // Other fingers closed
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    // Thumb closed
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    // Hand elevated
    animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI/6, "-"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "+"]);
    ref.animations.push(animations);
};

export const J = (ref) => {
    let animations = [];
    // Pinky finger extended, then curves down in motion
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", -Math.PI/12, "-"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    // Move downward
    animations.push(["mixamorigRightForeArm", "rotation", "z", Math.PI/4, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);
};

export const K = (ref) => {
    let animations = [];
    // Index up, middle up, others closed
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", Math.PI/4, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);
};

export const L = (ref) => {
    let animations = [];
    // Thumb and index extended
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", Math.PI/3, "+"]);
    // Other fingers closed
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);
};

export const M = (ref) => {
    let animations = [];
    // Thumb, index, middle closed on palm
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    // Ring and pinky extended
    animations.push(["mixamorigRightHandRing1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", -Math.PI/10, "-"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "+"]);
    ref.animations.push(animations);
};

export const N = (ref) => {
    let animations = [];
    // Thumb, index, middle closed
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    // Ring and pinky extended
    animations.push(["mixamorigRightHandRing1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", -Math.PI/10, "-"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "+"]);
    ref.animations.push(animations);
};

export const O = (ref) => {
    let animations = [];
    // All fingers curved together - O shape
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.5, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);
};

export const P = (ref) => {
    let animations = [];
    // Index and middle up
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/10, "-"]);
    // Ring and pinky closed
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    // Thumb closed
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    // Palm facing down
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/3, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    ref.animations.push(animations);
};

export const Q = (ref) => {
    let animations = [];
    // Same as P but hand facing different direction
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", -Math.PI/3, "-"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "+"]);
    ref.animations.push(animations);
};

export const R = (ref) => {
    let animations = [];
    // Index and middle crossed
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/8, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", Math.PI/4, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);
};

export const S = (ref) => {
    let animations = [];
    // Closed fist
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);
};

export const T = (ref) => {
    let animations = [];
    // Thumb closed between index and middle
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "y", 0, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);
};

export const U = (ref) => {
    let animations = [];
    // Index and middle extended
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/12, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/12, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);
};

export const V = (ref) => {
    let animations = [];
    // Index and middle extended making V shape
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);
};

export const W = (ref) => {
    let animations = [];
    // Index, middle, ring extended
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);
};

export const X = (ref) => {
    let animations = [];
    // Index extended, other fingers closed
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "y", Math.PI/3, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);
};

export const Y = (ref) => {
    let animations = [];
    // Thumb and pinky extended
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandThumb1", "rotation", "y", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);
};

export const Z = (ref) => {
    let animations = [];
    // Index extended with zigzag motion
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", -Math.PI/10, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", Math.PI/3, "+"]);
    // Z motion
    animations.push(["mixamorigRightForeArm", "rotation", "z", -Math.PI/6, "-"]);
    ref.animations.push(animations);
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightForeArm", "rotation", "z", 0, "+"]);
    ref.animations.push(animations);
};
