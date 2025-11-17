import { ElementJSON } from "../../types";
import { ElementVisitor } from "./element-visitor";
import { VideoElement } from "../elements/video.element";
import { AudioElement } from "../elements/audio.element";
import { ImageElement } from "../elements/image.element";
import { TextElement } from "../elements/text.element";
import { CaptionElement } from "../elements/caption.element";
import { RectElement } from "../elements/rect.element";
import { CircleElement } from "../elements/circle.element";
import { IconElement } from "../elements/icon.element";
import { TrackElement } from "../elements/base.element";
export declare class ElementSerializer implements ElementVisitor<ElementJSON> {
    serializeElement(element: TrackElement): ElementJSON;
    visitVideoElement(element: VideoElement): ElementJSON;
    visitAudioElement(element: AudioElement): ElementJSON;
    visitImageElement(element: ImageElement): ElementJSON;
    visitTextElement(element: TextElement): ElementJSON;
    visitCaptionElement(element: CaptionElement): ElementJSON;
    visitIconElement(element: IconElement): ElementJSON;
    visitCircleElement(element: CircleElement): ElementJSON;
    visitRectElement(element: RectElement): ElementJSON;
}
//# sourceMappingURL=element-serializer.d.ts.map