/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module ProjectsClient
 */
import type { AccessToken } from "@itwin/core-bentley";
import { request, RequestOptions } from "@bentley/itwin-client";
import { Project, ProjectsAccess, ProjectsQueryArg } from "./ProjectsAccessProps";

/** Client API to access the project services.
 * @beta
 */
export class ProjectsAccessClient implements ProjectsAccess {
  private _baseUrl: string = "https://api.bentley.com/projects/";

  public constructor() {
    const urlPrefix = process.env.IMJS_URL_PREFIX;
    if (urlPrefix) {
      const baseUrl = new URL(this._baseUrl);
      baseUrl.hostname = urlPrefix + baseUrl.hostname;
      this._baseUrl = baseUrl.href;
    }
  }

  /** Get projects accessible to the user
   * @param accessToken The client access token string
   * @param arg Options for paging and/or searching
   * @returns Array of projects, may be empty
   */
  public async getAll(accessToken: AccessToken, arg?: ProjectsQueryArg): Promise<Project[]> {
    return this.getByQuery(accessToken, arg);
  }

  /** Gets all projects using the given query options
   * @param accessToken The client access token string
   * @param queryArg Optional object containing queryable properties
   * @returns Array of projects meeting the query's requirements
   */
  private async getByQuery(accessToken: AccessToken, queryArg?: ProjectsQueryArg): Promise<Project[]> {
    const requestOptions: RequestOptions = this.getRequestOptions(accessToken);
    let url = this._baseUrl;
    if (queryArg)
      url = url + this.getQueryString(queryArg);

    const projects: Project[] = [];

    try {
      const response = await request(url, requestOptions);

      if (!response.body.projects) {
        new Error("Expected array of projects not found in API response.");
      }

      response.body.projects.forEach((project: any) => {
        projects.push({
          id: project.id,
          name: project.displayName,
          code: project.projectNumber,
        });
      });
    } catch (errorResponse: any) {
      throw Error(`API request error: ${JSON.stringify(errorResponse)}`);
    }

    return projects;
  }

  /**
   * Build the request methods, headers, and other options
   * @param accessTokenString The client access token string
   */
  private getRequestOptions(accessTokenString: string): RequestOptions {
    return {
      method: "GET",
      headers: {
        "authorization": accessTokenString,
        "content-type": "application/json",
      },
    };
  }

  /**
   * Build a query to be appended to a URL
   * @param queryArg Object container queryable properties
   * @returns String beginning with '?' to be appended to a URL, or it may be empty
   */
  private getQueryString(queryArg: ProjectsQueryArg): string {
    let queryBuilder = "";

    // Handle searches
    if (queryArg.search) {
      if (queryArg.search.exactMatch)
        queryBuilder = `${queryBuilder}${queryArg.search.propertyName}=${queryArg.search.searchString}&`;

      // Currently the API only allows substring searching across both name and code at the same time
      else
        queryBuilder = `${queryBuilder}$search=${queryArg.search.searchString}&`;
    }

    // Handle pagination
    if (queryArg.pagination) {
      if (queryArg.pagination.skip)
        queryBuilder = `${queryBuilder}$skip=${queryArg.pagination.skip}&`;
      if (queryArg.pagination.top)
        queryBuilder = `${queryBuilder}$top=${queryArg.pagination.top}&`;
    }

    // No query
    if ("" === queryBuilder)
      return queryBuilder;

    // slice off last '&'
    return `?${queryBuilder.slice(0, -1)}`;
  }
}
