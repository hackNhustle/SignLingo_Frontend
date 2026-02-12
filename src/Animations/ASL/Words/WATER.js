// ASL: WATER - W handshape, tap at chin twice
export const WATER = (ref) => {
    let animations = [];

    // Raise hand to chin level with W handshape
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/2.5, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/6, "+"]);
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/4, "+"]);
    
    // W handshape - three middle fingers up
    animations.push(["mixamorigRightHandIndex2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandIndex3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandMiddle3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing2", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandRing3", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHandPinky2", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandPinky3", "rotation", "z", Math.PI/3, "+"]);
    animations.push(["mixamorigRightHandThumb2", "rotation", "z", Math.PI/4, "+"]);
    animations.push(["mixamorigRightHandThumb3", "rotation", "z", Math.PI/4, "+"]);
    ref.animations.push(animations);

    // Tap at chin - move down slightly
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/2.2, "-"]);
    ref.animations.push(animations);

    // Move back up
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/2.5, "-"]);
    ref.animations.push(animations);

    // Return to neutral
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", 0, "-"]);
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
