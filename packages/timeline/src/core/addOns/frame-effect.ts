import { FrameEffect, FrameEffectProps } from "../../types";

export class ElementFrameEffect {
  private s: number;
  private e: number;
  private props!: FrameEffectProps;
  constructor(start: number, end: number) {
    this.s = start;
    this.e = end;
  }

  setProps(props: FrameEffectProps) {
    this.props = props;
    return this;
  }

  getProps() {
    return this.props;
  }

  getStart() {
    return this.s;
  }

  getEnd() {
    return this.e;
  }

  setStart(start: number) {
    this.s = start;
    return this;
  }

  setEnd(end: number) {
    this.e = end;
    return this;
  }

  toJSON(): FrameEffect {
    return {
      type: this.props.type,
      s: this.s,
      e: this.e,
      props: this.props,
    } as FrameEffect;
  }
  
  static fromJSON(json: FrameEffect) {
    const effect = new ElementFrameEffect(json.s || 0, json.e || 0);
    if (json.props) effect.setProps({ type: json.type, ...json.props } as FrameEffectProps);
    return effect;
  }
}
