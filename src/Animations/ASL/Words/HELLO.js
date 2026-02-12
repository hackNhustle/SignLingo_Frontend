// ASL: HELLO - Wave hand to side
export const HELLO = (ref) => {
    let animations = [];

    // Raise right arm to shoulder height
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "z", Math.PI/8, "+"]);
    ref.animations.push(animations);

    // Wave hand back and forth
    for (let i = 0; i < 3; i++) {
        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "y", Math.PI/6, "+"]);
        ref.animations.push(animations);

        animations = [];
        animations.push(["mixamorigRightForeArm", "rotation", "y", -Math.PI/6, "-"]);
        ref.animations.push(animations);
    }

    // Lower arm to rest
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "z", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
