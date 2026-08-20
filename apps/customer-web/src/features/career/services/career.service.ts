import { apiClient } from '@/infrastructure/api/axios-client';

import type {
  CareerApplicationRequest,
  CareerApplicationResponse,
} from '../types/career.types';

class CareerService {
  async submitApplication(
    data: CareerApplicationRequest,
  ): Promise<CareerApplicationResponse> {
    const formData = new FormData();

    formData.append(
      'fullName',
      data.fullName,
    );

    formData.append(
      'mobileNumber',
      data.mobileNumber,
    );

    formData.append(
      'address',
      data.address,
    );

    formData.append(
      'appliedPosition',
      data.appliedPosition,
    );

    formData.append(
      'resume',
      data.resume,
    );

    const response =
      await apiClient.post<CareerApplicationResponse>(
        '/careers/apply',
        formData,
      );

    return response.data;
  }
}

export const careerService =
  new CareerService();