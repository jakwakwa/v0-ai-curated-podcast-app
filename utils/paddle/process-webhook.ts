import { type CustomerCreatedEvent, type CustomerUpdatedEvent, type EventEntity, EventName, type SubscriptionCreatedEvent, type SubscriptionUpdatedEvent } from "@paddle/paddle-node-sdk"

export class ProcessWebhook {
	async processEvent(eventData: EventEntity) {
		switch (eventData.eventType) {
			case EventName.SubscriptionCreated:
			case EventName.SubscriptionUpdated:
				await this.updateSubscriptionData(eventData)
				break
			case EventName.CustomerCreated:
			case EventName.CustomerUpdated:
				await this.updateCustomerData(eventData)
				break
		}
	}

	private async updateSubscriptionData(_eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
		// update database and subsription models:
		// paddle_customer id
		// subsctiption status
		// price id
		// product id
		// user id
		// scheduled change
		// if (error) throw error
	}

	private async updateCustomerData(_eventData: CustomerCreatedEvent | CustomerUpdatedEvent) {
		// paddle_customer_id: eventData.data.id,
		// email: eventData.data.email,
		// if (error) throw error
	}
}
