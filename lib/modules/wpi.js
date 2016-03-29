/*
* This files purpose is to return a mock of Gpio when not running in prod env
* (the pi-gpio package blows up on anything but a pi)
* */
import wpi from 'wiring-pi';

export type Mode = wpi.INPUT | wpi.OUTPUT;

export const INPUT = wpi.INPUT;
export const OUTPUT = wpi.OUTPUT;

export const PUD_DOWN = wpi.PUD_DOWN;

export default wpi;