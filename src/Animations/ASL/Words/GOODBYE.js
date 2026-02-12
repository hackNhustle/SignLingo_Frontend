// ASL: GOODBYE - Wave hand downward
export const GOODBYE = (ref) => {
    let animations = [];

    // Raise right hand
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/3, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/6, "+"]);
    ref.animations.push(animations);

    // Wave hand down (3 times)
    for (let i = 0; i < 3; i++) {
        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "x", Math.PI/8, "+"]);
        ref.animations.push(animations);

        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "x", -Math.PI/8, "-"]);
        ref.animations.push(animations);
    }

    // Lower arm
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
