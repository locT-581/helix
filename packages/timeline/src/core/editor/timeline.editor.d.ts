import { Track } from "../track/track";
import { TimelineTrackData } from "../../services/data.service";
import { SplitResult } from "../visitor/element-splitter";
import { TrackElement } from "../elements/base.element";
import { ProjectJSON, TrackJSON } from "../../types";
/**
 * Type for timeline operation context
 */
export interface TimelineOperationContext {
    contextId: string;
    setTotalDuration: (duration: number) => void;
    setPresent: (data: ProjectJSON) => void;
    handleUndo: () => ProjectJSON | null;
    handleRedo: () => ProjectJSON | null;
    handleResetHistory: () => void;
    updateChangeLog: () => void;
    setTimelineAction?: (action: string, payload?: unknown) => void;
}
/**
 * TimelineEditor
 *
 * This class provides an interface to execute all timeline operations
 * using a direct, class-based approach with track-based management.
 * It also handles undo/redo operations internally.
 */
export declare class TimelineEditor {
    private context;
    private totalDuration;
    constructor(context: TimelineOperationContext);
    getContext(): TimelineOperationContext;
    pauseVideo(): void;
    getTimelineData(): TimelineTrackData | null;
    getLatestVersion(): number;
    protected setTimelineData({ tracks, version, updatePlayerData, }: {
        tracks: Track[];
        version?: number;
        updatePlayerData?: boolean;
    }): TimelineTrackData;
    addTrack(name: string, type?: string): Track;
    getTrackById(id: string): Track | null;
    getTrackByName(name: string): Track | null;
    getSubtiltesTrack(): Track | null;
    removeTrackById(id: string): void;
    removeTrack(track: Track): void;
    /**
     * Refresh the timeline data
     */
    refresh(): void;
    /**
     * Add an element to a specific track using the visitor pattern
     * @param track The track to add the element to
     * @param element The element to add
     * @returns Promise<boolean> true if element was added successfully
     */
    addElementToTrack(track: Track, element: TrackElement): Promise<boolean>;
    /**
     * Remove an element from a specific track using the visitor pattern
     * @param element The element to remove
     * @returns boolean true if element was removed successfully
     */
    removeElement(element: TrackElement): boolean;
    /**
     * Update an element in a specific track using the visitor pattern
     * @param element The updated element
     * @returns TrackElement the updated element
     */
    updateElement(element: TrackElement): TrackElement;
    /**
     * Split an element at a specific time point using the visitor pattern
     * @param element The element to split
     * @param splitTime The time point to split at
     * @returns SplitResult with first element, second element, and success status
     */
    splitElement(element: TrackElement, splitTime: number): Promise<SplitResult>;
    /**
     * Clone an element using the visitor pattern
     * @param element The element to clone
     * @returns TrackElement | null - the cloned element or null if cloning failed
     */
    cloneElement(element: TrackElement): TrackElement | null;
    reorderTracks(tracks: Track[]): void;
    updateHistory(timelineTrackData: TimelineTrackData): void;
    /**
     * Trigger undo operation and update timeline data
     */
    undo(): void;
    /**
     * Trigger redo operation and update timeline data
     */
    redo(): void;
    /**
     * Reset history and clear timeline data
     */
    resetHistory(): void;
    loadProject({ tracks, version, }: {
        tracks: TrackJSON[];
        version: number;
    }): void;
    getVideoAudio(): Promise<string>;
}
//# sourceMappingURL=timeline.editor.d.ts.map