import type { ElementVisitor } from "./element-visitor";
import { VideoElement } from "../elements/video.element";
import { AudioElement } from "../elements/audio.element";
import { ImageElement } from "../elements/image.element";
import { TextElement } from "../elements/text.element";
import { CaptionElement } from "../elements/caption.element";
import { IconElement } from "../elements/icon.element";
import { CircleElement } from "../elements/circle.element";
import { RectElement } from "../elements/rect.element";
export declare const VALIDATION_ERROR_CODE: {
    ELEMENT_NOT_FOUND: string;
    ELEMENT_NOT_ADDED: string;
    ELEMENT_NOT_UPDATED: string;
    ELEMENT_NOT_REMOVED: string;
    COLLISION_ERROR: string;
    INVALID_TIMING: string;
};
export declare class ValidationError extends Error {
    errors: string[];
    warnings: string[];
    constructor(message: string, errors: string[], warnings?: string[]);
}
export declare class ElementValidator implements ElementVisitor<boolean> {
    private validateBasicProperties;
    private validateTextElement;
    private validateVideoElement;
    private validateAudioElement;
    private validateImageElement;
    private validateCaptionElement;
    private validateIconElement;
    private validateCircleElement;
    private validateRectElement;
    visitVideoElement(element: VideoElement): boolean;
    visitAudioElement(element: AudioElement): boolean;
    visitImageElement(element: ImageElement): boolean;
    visitTextElement(element: TextElement): boolean;
    visitCaptionElement(element: CaptionElement): boolean;
    visitIconElement(element: IconElement): boolean;
    visitCircleElement(element: CircleElement): boolean;
    visitRectElement(element: RectElement): boolean;
}
//# sourceMappingURL=element-validator.d.ts.map