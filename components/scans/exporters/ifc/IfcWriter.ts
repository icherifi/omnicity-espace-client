/**
 * Low-level IFC STEP file builder.
 *
 * Accumulates IFC entity lines in memory, then serialises the entire document
 * as a valid IFC4 STEP file string on demand.
 *
 * Entity IDs are allocated sequentially via nextId().  Callers are responsible
 * for calling nextId() before adding each entity so that forward-references
 * can be constructed before the referenced entity is actually written.
 *
 * Usage:
 * ```ts
 * const w = new IfcWriter();
 *
 * const ptId = w.nextId();
 * w.entity(ptId, 'IFCCARTESIANPOINT', '(0.,0.,0.)');
 *
 * const step = w.serialize('MyProject');
 * ```
 */

import { str } from "./IfcUtils";

export class IfcWriter {
  private lines: string[] = [];
  private _nextId = 1;

  /** Allocate the next sequential entity ID without adding an entity line. */
  nextId(): number {
    return this._nextId++;
  }

  /**
   * Append a STEP entity line.
   *
   * @param id     - Entity ID (positive integer)
   * @param type   - IFC entity type in UPPER_CASE, e.g. 'IFCWALL'
   * @param params - Pre-formatted parameter strings, one per IFC attribute
   *
   * Produces:  #ID= TYPE(p1,p2,...);
   */
  entity(id: number, type: string, ...params: string[]): void {
    this.lines.push(`#${id}= ${type}(${params.join(",")});`);
  }

  /**
   * Append an inline STEP comment (useful for grouping related entities).
   * Produces:  /* text * /
   */
  comment(text: string): void {
    this.lines.push(`/* ${text} */`);
  }

  /**
   * Serialise the accumulated entities into a complete IFC4 STEP file string.
   *
   * @param fileName - Used in the FILE_NAME header (without extension).
   */
  serialize(fileName: string): string {
    const now = new Date().toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:MM:SS'

    const header = [
      "ISO-10303-21;",
      "HEADER;",
      "FILE_DESCRIPTION(('ViewDefinition [CoordinationView]'),'2;1');",
      // FILE_NAME: name, time_stamp, author, organization, preprocessor_version, originating_system, authorization
      `FILE_NAME(${str(fileName)},${str(now)},(''),(''),'','Omicity IFC Exporter 1.0','');`,
      "FILE_SCHEMA(('IFC4'));",
      "ENDSEC;",
      "",
      "DATA;",
    ];

    const footer = ["ENDSEC;", "END-ISO-10303-21;"];

    return [...header, ...this.lines, ...footer].join("\n");
  }
}
