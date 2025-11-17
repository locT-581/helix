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
import { ElementAnimation } from "../addOns/animation";
import { ElementFrameEffect } from "../addOns/frame-effect";
import { ElementTextEffect } from "../addOns/text-effect";

export class ElementDeserializer {
  private static deserializeBaseElement(element: TrackElement, json: ElementJSON): void {
    const jsonAny = json as any;
    if (json.id) element.setId(json.id);
    if (jsonAny.trackId) element.setTrackId(jsonAny.trackId || '');
    if (json.s !== undefined) element.setStart(json.s);
    if (json.e !== undefined) element.setEnd(json.e);
    if (jsonAny.props) element.setProps(jsonAny.props);
    if (jsonAny.animation) element.setAnimation(ElementAnimation.fromJSON(jsonAny.animation));
  }

  static deserializeVideoElement(json: ElementJSON): VideoElement {
    const jsonAny = json as any;
    const props = jsonAny.props || {};
    const parentSize = jsonAny.frame && jsonAny.frame.size 
      ? { width: jsonAny.frame.size[0], height: jsonAny.frame.size[1] } 
      : { width: 0, height: 0 };
    
    const videoElement = new VideoElement(props.src || "", parentSize);
    ElementDeserializer.deserializeBaseElement(videoElement, json);
    
    if (jsonAny.mediaDuration !== undefined) videoElement.setMediaDuration(jsonAny.mediaDuration || 0);
    if (jsonAny.objectFit) videoElement.setObjectFit(jsonAny.objectFit);
    if (jsonAny.frame) videoElement.setFrame(jsonAny.frame);
    if (jsonAny.frameEffects) videoElement.setFrameEffects(jsonAny.frameEffects.map((frameEffect: any) => ElementFrameEffect.fromJSON(frameEffect)));
    if (jsonAny.backgroundColor) videoElement.setBackgroundColor(jsonAny.backgroundColor);
    
    return videoElement;
  }

  static deserializeAudioElement(json: ElementJSON): AudioElement {
    const jsonAny = json as any;
    const props = jsonAny.props || {};
    const audioElement = new AudioElement(props.src || "");
    ElementDeserializer.deserializeBaseElement(audioElement, json);
    
    if (jsonAny.mediaDuration !== undefined) audioElement.setMediaDuration(jsonAny.mediaDuration || 0);
    
    return audioElement;
  }

  static deserializeImageElement(json: ElementJSON): ImageElement {
    const jsonAny = json as any;
    const props = jsonAny.props || {};
    const parentSize = jsonAny.frame && jsonAny.frame.size 
      ? { width: jsonAny.frame.size[0], height: jsonAny.frame.size[1] } 
      : { width: 0, height: 0 };
    
    const imageElement = new ImageElement(props.src || "", parentSize);
    ElementDeserializer.deserializeBaseElement(imageElement, json);
    
    if (jsonAny.objectFit) imageElement.setObjectFit(jsonAny.objectFit);
    if (jsonAny.frame) imageElement.setFrame(jsonAny.frame);
    if (jsonAny.frameEffects) imageElement.setFrameEffects(jsonAny.frameEffects.map((frameEffect: any) => ElementFrameEffect.fromJSON(frameEffect)));
    if (jsonAny.backgroundColor) imageElement.setBackgroundColor(jsonAny.backgroundColor);
    
    return imageElement;
  }

  static deserializeTextElement(json: ElementJSON): TextElement {
    const props = json.props as any;
    const textElement = new TextElement(props?.text || "");
    ElementDeserializer.deserializeBaseElement(textElement, json);
    
    const jsonAny = json as any;
    if (jsonAny.textEffect) textElement.setTextEffect(ElementTextEffect.fromJSON(jsonAny.textEffect));
    
    return textElement;
  }

  static deserializeCaptionElement(json: ElementJSON): CaptionElement {
    const jsonAny = json as any;
    const captionElement = new CaptionElement(
      jsonAny.t || "",
      jsonAny.s || 0,
      jsonAny.e || 0
    );
    ElementDeserializer.deserializeBaseElement(captionElement, json);
    
    return captionElement;
  }

  static deserializeIconElement(json: ElementJSON): IconElement {
    const props = json.props as any;
    const size = props?.size ?? { width: 100, height: 100 };
    
    const iconElement = new IconElement(
      props?.src || "",
      size,
      props?.fill
    );
    ElementDeserializer.deserializeBaseElement(iconElement, json);
    
    return iconElement;
  }

  static deserializeCircleElement(json: ElementJSON): CircleElement {
    const props = json.props as any;
    const circleElement = new CircleElement(
      props?.fill,
      props?.radius || 50
    );
    ElementDeserializer.deserializeBaseElement(circleElement, json);
    
    return circleElement;
  }

  static deserializeRectElement(json: ElementJSON): RectElement {
    const rectElement = new RectElement(
      { 
        width: (json.props as { width?: number })?.width || 0, 
        height: (json.props as { height?: number })?.height || 0 
      },
      (json.props as { fill?: string })?.fill || '#000000'
    );
    ElementDeserializer.deserializeBaseElement(rectElement, json);
    
    return rectElement;
  }

  static fromJSON(json: ElementJSON): TrackElement | null{
    try {
    switch (json.type) {
      case "video":
        return ElementDeserializer.deserializeVideoElement(json);
      case "audio":
        return ElementDeserializer.deserializeAudioElement(json);
      case "image":
        return ElementDeserializer.deserializeImageElement(json);
      case "text":
        return ElementDeserializer.deserializeTextElement(json);
      case "caption":
        return ElementDeserializer.deserializeCaptionElement(json);
      case "icon":
        return ElementDeserializer.deserializeIconElement(json);
      case "circle":
        return ElementDeserializer.deserializeCircleElement(json);
      case "rect":
        return ElementDeserializer.deserializeRectElement(json);
      default:
        throw new Error(`Unknown element type: ${json.type}`);
    }
   } catch(error) {
    console.error("Error deserializing element:", error);
    return null;
   }
  }
}
