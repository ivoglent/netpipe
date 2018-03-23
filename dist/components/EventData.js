"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventData {
    constructor() {
        this.data = {};
        this.from = '';
        this.to = 'all';
        this.error = false;
        this.message = 'Success request';
        this.event = 'NONE';
        this.timestamp = new Date().getTime();
    }
}
exports.EventData = EventData;
