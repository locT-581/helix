export type Animation = {
    name: string;
    interval?: number;
    duration?: number;
    intensity?: number;
    animate?: "enter" | "exit" | "both";
    mode?: "in" | "out";
    direction?: "up" | "down" | "left" | "right" | "center";
    options?: {
        animate?: ("enter" | "exit" | "both")[];
        mode?: ("in" | "out")[];
        direction?: ("left" | "right" | "center" | "up" | "down")[];
        intensity?: [number, number];
        interval?: [number, number];
        duration?: [number, number];
    };
    getSample?: (animation?: Animation) => string;
};
export type Size = {
    width: number;
    height: number;
};
export type Position = {
    x: number;
    y: number;
};
export type Frame = {
    width: number;
    height: number;
    size?: [number, number];
    top?: number;
    left?: number;
    x?: number;
    y?: number;
};
export type ObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type VideoProps = {
    src: string;
    frame?: Frame;
    objectFit?: ObjectFit;
    position?: Position;
    volume?: number;
    playbackRate?: number;
    time?: number;
    mediaFilter?: string;
};
export type TextProps = {
    content?: string;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number;
    fontStyle?: 'normal' | 'italic';
    color?: string;
    fill?: string;
    textAlign?: TextAlign;
    backgroundColor?: string;
    padding?: number;
    rotation?: number;
    stroke?: string;
    lineWidth?: number;
};
export type RectProps = {
    width: number;
    height: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeColor?: string;
    lineWidth?: number;
    radius?: number;
};
export type ImageProps = {
    src: string;
    frame?: Frame;
    objectFit?: ObjectFit;
    position?: Position;
    mediaFilter?: string;
};
export type AudioProps = {
    src: string;
    volume?: number;
    playbackRate?: number;
    time?: number;
    loop?: boolean;
};
export type CircleProps = {
    radius: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeColor?: string;
    lineWidth?: number;
    width?: number;
    height?: number;
};
export type ElementJSON = {
    id: string;
    type: string;
    s: number;
    e: number;
    [key: string]: unknown;
};
export type ProjectJSON = {
    tracks: TrackJSON[];
    version: number;
};
export type TrackJSON = {
    id: string;
    name: string;
    type?: string;
    props?: unknown;
    elements: ElementJSON[];
};
export type FrameEffect = {
    type: "circle" | "rect";
    radius?: number;
    width?: number;
    height?: number;
    s?: number;
    e?: number;
    props?: {
        radius?: number;
        width?: number;
        height?: number;
    };
};
export type FrameEffectProps = FrameEffect;
export type TextEffect = {
    name: string;
    duration?: number;
    delay?: number;
    intensity?: number;
    bufferTime?: number;
};
//# sourceMappingURL=index.d.ts.map