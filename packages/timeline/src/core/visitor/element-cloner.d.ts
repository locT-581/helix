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
export declare class ElementCloner implements ElementVisitor<TrackElement> {
    cloneElementProperties(srcElement: TrackElement, destElement: TrackElement): TrackElement;
    visitVideoElement(element: VideoElement): TrackElement;
    visitAudioElement(element: AudioElement): TrackElement;
    visitImageElement(element: ImageElement): TrackElement;
    visitTextElement(element: TextElement): TrackElement;
    visitCaptionElement(element: CaptionElement): TrackElement;
    visitRectElement(element: RectElement): TrackElement;
    visitCircleElement(element: CircleElement): TrackElement;
    visitIconElement(element: IconElement): TrackElement;
}
//# sourceMappingURL=element-cloner.d.ts.map