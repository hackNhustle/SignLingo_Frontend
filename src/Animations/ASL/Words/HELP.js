// ASL: HELP - One hand supporting the other
export const HELP = (ref) => {
    let animations = [];

    // Left hand open
    animations.push(["mixamorigLeftHand", "rotation", "x", Math.PI/4, "+"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", -Math.PI/4, "-"]);
    ref.animations.push(animations);

    // Right fist on left palm
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/4, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "y", Math.PI/4, "+"]);
    ref.animations.push(animations);

    // Lift right hand up
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/2, "-"]);
    ref.animations.push(animations);

    // Return to neutral
    animations = [];
    animations.push(["mixamorigLeftHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigLeftArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "y", 0, "-"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
