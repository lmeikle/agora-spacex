import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LaunchData } from '../models/LaunchData';
import { RocketData } from '../models/RocketData';

export const spacexApi = createApi({
  reducerPath: 'spacexApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.spacexdata.com/v4/' }),
  endpoints: (builder) => ({
    getPastLaunches: builder.query<LaunchData[], void>({
      query: () => {
        return {
          url: 'launches/query',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            query: {},
            options: {
              select: ['name', 'date_utc', 'details', 'rocket'],
              sort: '-date_utc',
              limit: 50,
            },
          },
        };
      },
      transformResponse: (response: any): LaunchData[] => {
        return response.docs || [];
      },
    }),
    getRocketDetails: builder.query<RocketData, string>({
      query: (id: string) => {
        return {
          url: `rockets/${id}`,
        };
      },
      transformResponse: (response: any): RocketData => {
        return {
          name: response.name,
          description: response.description,
          wikipedia: response.wikipedia,
        };
      },
    }),
  }),
});

export const { useGetPastLaunchesQuery, useGetRocketDetailsQuery } = spacexApi;
