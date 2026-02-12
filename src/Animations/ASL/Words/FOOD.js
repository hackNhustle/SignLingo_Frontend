// ASL: FOOD - Fingertips together at mouth
export const FOOD = (ref) => {
    let animations = [];

    // Fingers together to mouth
    animations.push(["mixamorigRightHand", "rotation", "x", Math.PI/6, "+"]);
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/3, "-"]);
    ref.animations.push(animations);

    // Move hand down
    animations = [];
    animations.push(["mixamorigRightArm", "rotation", "x", -Math.PI/4, "+"]);
    ref.animations.push(animations);

    // Return to neutral
    animations = [];
    animations.push(["mixamorigRightHand", "rotation", "x", 0, "-"]);
    animations.push(["mixamorigRightArm", "rotation", "x", 0, "+"]);
    ref.animations.push(animations);

    if (ref.pending === false) {
        ref.pending = true;
        ref.animate();
    }
};
