import { DebugElement, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';

import { DOMSelector } from '../dom-selectors';
import { getChildren, setComponentProps } from '../internals/query';
import { Spectator } from '../spectator/spectator';
import { Token } from '../token';
import { isString, QueryOptions, QueryType } from '../types';

import { HostComponent } from './host-component';

/**
 * @publicApi
 */
export class SpectatorWithHost<C, H = HostComponent> extends Spectator<C> {
  constructor(public hostComponent: H, public hostDebugElement: DebugElement, public hostElement: HTMLElement, fixture: ComponentFixture<any>, debugElement?: DebugElement) {
    super(fixture, debugElement || hostDebugElement, debugElement ? debugElement.componentInstance : hostComponent, debugElement ? debugElement.nativeElement : hostDebugElement.nativeElement);
  }

  queryHost<R extends Element>(selector: string | DOMSelector, options?: { root: boolean }): R | null;
  queryHost<R>(directive: Type<R>): R | null;
  queryHost<R>(directiveOrSelector: Type<any> | string, options: { read: Token<R> }): R | null;
  queryHost<R>(directiveOrSelector: QueryType, options?: QueryOptions<R>): R | null {
    if ((options || {}).root && isString(directiveOrSelector)) {
      return document.querySelector(directiveOrSelector) as any;
    }

    return getChildren<R>(this.hostDebugElement)(directiveOrSelector, options)[0] || null;
  }

  queryHostAll<R extends Element[]>(selector: string | DOMSelector, options?: { root: boolean }): R[];
  queryHostAll<R>(directive: Type<R>): R[];
  queryHostAll<R>(directiveOrSelector: Type<any> | string, options: { read: Token<R> }): R[];
  queryHostAll<R>(directiveOrSelector: QueryType, options?: QueryOptions<R>): R[] {
    if ((options || {}).root && isString(directiveOrSelector)) {
      return Array.from(document.querySelectorAll(directiveOrSelector)) as any[];
    }

    return getChildren<R>(this.hostDebugElement)(directiveOrSelector, options);
  }

  setHostInput<K extends keyof H>(input: Partial<H>);
  setHostInput<K extends keyof H>(input: K, inputValue: H[K]);
  setHostInput<K extends keyof H>(input: Partial<H> | K, value?: H[K]) {
    setComponentProps(this.hostComponent, input, value);
    this.detectChanges();
  }
}