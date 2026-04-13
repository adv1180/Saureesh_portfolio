export const handleMouseMove = (event: MouseEvent, callback: (x: number, y: number) => void) => {
    callback((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
};
export const handleTouchMove = (event: TouchEvent, callback: (x: number, y: number) => void) => {
    if (event.touches.length > 0) {
        callback((event.touches[0].clientX / window.innerWidth) * 2 - 1, -(event.touches[0].clientY / window.innerHeight) * 2 + 1);
    }
};
export const handleTouchEnd = (callback: (x: number, y: number, ix: number, iy: number) => void) => {
    callback(0, 0, 0.1, 0.2);
};
export const handleHeadRotation = (head: any, mx: number, my: number, ix: number, iy: number, lerp: any) => {
    head.rotation.y = lerp(head.rotation.y, mx * 0.5, ix);
    head.rotation.x = lerp(head.rotation.x, -my * 0.5, iy);
};
