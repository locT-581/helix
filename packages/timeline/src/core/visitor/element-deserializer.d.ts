import { ElementJSON } from "../../types";
import { VideoElement } from "../elements/video.element";
import { AudioElement } from "../elements/audio.element";
import { ImageElement } from "../elements/image.element";
import { TextElement } from "../elements/text.element";
import { CaptionElement } from "../elements/caption.element";
import { IconElement } from "../elements/icon.element";
import { CircleElement } from "../elements/circle.element";
import { RectElement } from "../elements/rect.element";
import { TrackElement } from "../elements/base.element";
export declare class ElementDeserializer {
    private static deserializeBaseElement;
    static deserializeVideoElement(json: ElementJSON): VideoElement;
    static deserializeAudioElement(json: ElementJSON): AudioElement;
    static deserializeImageElement(json: ElementJSON): ImageElement;
    static deserializeTextElement(json: ElementJSON): TextElement;
    static deserializeCaptionElement(json: ElementJSON): CaptionElement;
    static deserializeIconElement(json: ElementJSON): IconElement;
    static deserializeCircleElement(json: ElementJSON): CircleElement;
    static deserializeRectElement(json: ElementJSON): RectElement;
    static fromJSON(json: ElementJSON): TrackElement | null;
}
//# sourceMappingURL=element-deserializer.d.ts.map