/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module ProjectsClient
 */

import { AccessToken } from "@itwin/core-bentley";

/** The a simplified project object
 * @beta
 */
export interface Project {
  name?: string;
  id: string;
  code?: string;
}

/** Argument for methods that may take pagination
 * @beta
*/
export interface ProjectsPaginationArg {
  top?: number;
  skip?: number;
}

/** Set of properties that can be searched
 * @beta
*/
export enum ProjectsSearchableProperty {
  Name = "displayName",
}

/** Argument for methods that may take searching
 * @beta
*/
export interface ProjectsSearchArg {
  searchString: string;
  propertyName: ProjectsSearchableProperty;
  exactMatch: boolean;
}

/** Set of optional arguments used for methods that allow advanced queries
 * @beta
 */
export interface ProjectsQueryArg {
  pagination?: ProjectsPaginationArg;
  search?: ProjectsSearchArg;
}

/** Methods for accessing projects
 * @beta
*/
export interface ProjectsAccess {
  /** Get projects associated with the requester */
  getAll(accessToken: AccessToken, arg?: ProjectsQueryArg): Promise<Project[]>;
}
