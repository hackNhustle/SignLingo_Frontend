// Authentic ASL Letter A - Closed fist with thumb to side
export const A = (ref) => {
    let animations = [];
    
    // ASL A: Closed fist with thumb pointing up/to side
    // Right hand primary, closed position
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandIndex3", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle2", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandMiddle3", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing2", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandRing3", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky2", "rotation", "z", Math.PI/2.2, "+"]);
    animations.push(["mixamorigRightHandPinky3", "rotation", "z", Math.PI/2.2, "+"]);
    
    // Thumb extended to side
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", -Math.PI/6, "-"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "z", -Math.PI/8, "-"]);
    
    // Position hand at chest level
    animations.push(["mixamorigRightForeArm", "rotation", "x", Math.PI/6, "+"]);
    
    ref.animations.push(animations);
    
    // Reset
    animations = [];
    animations.push(["mixamorigRightHandIndex1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky1", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandThumb1", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "z", 0, "+"]);
    animations.push(["mixamorigRightForeArm", "rotation", "x", 0, "-"]);
    
    ref.animations.push(animations);
};
