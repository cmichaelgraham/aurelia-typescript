import { Metadata } from '../metadata/index';
import { Transient, Singleton } from './metadata';
export { Registration, Transient, Singleton, Resolver, Lazy, All, Optional, Parent } from './metadata';
export { Container } from './container';
Metadata.configure.classHelper('transient', Transient);
Metadata.configure.classHelper('singleton', Singleton);
