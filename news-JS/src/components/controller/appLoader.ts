import Loader from './loader';
import { Endpoints, LoaderOptions } from '../../types';

export default class AppLoader extends Loader {
    constructor() {
        super(process.env.API_URL!, { apiKey: process.env.API_KEY! });
    }

    public getResp<T>(params: { endpoint: Endpoints; options?: LoaderOptions }, callback: (data: T) => void): void {
        super.getResp<T>(params, callback);
    }
}

