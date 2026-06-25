import { InvalidShippingConfigurationException } from '../exceptions/invalid-shipping-configuration.exception';

export class ShippingConfiguration {
  constructor(
    public readonly id: string,
    public shippingFee: number,
    public freeShippingThreshold: number,
    public isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    this.validate();
  }

  calculateShipping(subtotal: number): number {
    if (subtotal <= 0) {
      return 0;
    }

    if (subtotal >= this.freeShippingThreshold) {
      return 0;
    }

    return this.shippingFee;
  }

  isFreeShipping(subtotal: number): boolean {
    return subtotal > 0 && this.calculateShipping(subtotal) === 0;
  }

  activate() {
    this.isActive = true;
    this.touch();
  }

  deactivate() {
    this.isActive = false;
    this.touch();
  }

  updateDetails(params: {
    shippingFee?: number;
    freeShippingThreshold?: number;
    isActive?: boolean;
  }) {
    if (params.shippingFee !== undefined) {
      this.shippingFee = Number(params.shippingFee.toFixed(2));
    }

    if (params.freeShippingThreshold !== undefined) {
      this.freeShippingThreshold = Number(params.freeShippingThreshold.toFixed(2));
    }

    if (params.isActive !== undefined) {
      this.isActive = params.isActive;
    }

    this.validate();
    this.touch();
  }

  validate() {
    if (!Number.isFinite(this.shippingFee) || this.shippingFee < 0) {
      throw new InvalidShippingConfigurationException({
        field: 'shippingFee',
        message: 'Shipping fee must be zero or greater',
      });
    }

    if (!Number.isFinite(this.freeShippingThreshold) || this.freeShippingThreshold <= 0) {
      throw new InvalidShippingConfigurationException({
        field: 'freeShippingThreshold',
        message: 'Free shipping threshold must be greater than zero',
      });
    }
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
