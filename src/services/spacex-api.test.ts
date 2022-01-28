import faker from '@faker-js/faker';
import fetchMock from 'jest-fetch-mock';
import { store } from '../app/store';
import { spacexApi } from './spacex-api';

describe('getPastLaunches', () => {
  const mockData = {
    docs: ['some data'],
  };

  afterEach(() => {
    fetchMock.resetMocks();

    // clear RTK Query cache after each test
    store.dispatch(spacexApi.util.resetApiState());
  });

  it('request is correct', () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    return store.dispatch<any>(spacexApi.endpoints.getPastLaunches.initiate(undefined)).then(() => {
      expect(fetchMock).toBeCalledTimes(1);

      const { method, headers, url, body } = fetchMock.mock.calls[0][0] as Request;

      expect(method).toBe('POST');
      expect(url).toBe('https://api.spacexdata.com/v4/launches/query');
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(JSON.parse(body as unknown as string).query).toEqual({});
      expect(JSON.parse(body as unknown as string).options).toEqual({
        select: ['name', 'date_utc', 'details', 'rocket'],
        sort: '-date_utc',
        limit: 50,
      });
    });
  });

  it('successful response', () => {
    fetchMock.mockResponse(JSON.stringify(mockData));

    return store.dispatch<any>(spacexApi.endpoints.getPastLaunches.initiate(undefined)).then((action: any) => {
      const { status, data, isSuccess } = action;
      expect(status).toBe('fulfilled');
      expect(isSuccess).toBe(true);
      expect(data).toStrictEqual(mockData.docs);
    });
  });

  it('unsuccessful response', () => {
    fetchMock.mockReject(new Error('Internal Server Error'));

    return store.dispatch<any>(spacexApi.endpoints.getPastLaunches.initiate(undefined)).then((action: any) => {
      const {
        status,
        error: { error },
        isError,
      } = action;
      expect(status).toBe('rejected');
      expect(isError).toBe(true);
      expect(error).toBe('Error: Internal Server Error');
    });
  });
});

describe('getRocketDetails', () => {
  const id = faker.datatype.uuid();
  const mockData = {
    name: faker.lorem.words(2),
    description: faker.lorem.paragraph(),
    wikipedia: faker.internet.url(),
  };

  afterEach(() => {
    fetchMock.resetMocks();

    // clear RTK Query cache after each test
    store.dispatch(spacexApi.util.resetApiState());
  });

  it('request is correct', () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    return store.dispatch<any>(spacexApi.endpoints.getRocketDetails.initiate(id)).then(() => {
      expect(fetchMock).toBeCalledTimes(1);

      const { method, url } = fetchMock.mock.calls[0][0] as Request;

      expect(method).toBe('GET');
      expect(url).toBe(`https://api.spacexdata.com/v4/rockets/${id}`);
    });
  });

  it('successful response', () => {
    fetchMock.mockResponse(JSON.stringify(mockData));

    return store.dispatch<any>(spacexApi.endpoints.getRocketDetails.initiate(id)).then((action: any) => {
      const { status, data, isSuccess } = action;
      expect(status).toBe('fulfilled');
      expect(isSuccess).toBe(true);
      expect(data).toStrictEqual(mockData);
    });
  });

  it('unsuccessful response', () => {
    fetchMock.mockReject(new Error('Internal Server Error'));

    return store.dispatch<any>(spacexApi.endpoints.getRocketDetails.initiate(id)).then((action: any) => {
      const {
        status,
        error: { error },
        isError,
      } = action;
      expect(status).toBe('rejected');
      expect(isError).toBe(true);
      expect(error).toBe('Error: Internal Server Error');
    });
  });
});
