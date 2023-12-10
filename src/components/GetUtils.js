import { makeApiGetRequest } from "./ApiUtils";

export async function fetchCustomerIds() {
  try {
    const customerData = await makeApiGetRequest("/api/v1/customers");
    const ids = customerData.map((customer) => customer.id);
    return ids;
  } catch (error) {
    console.error("Error fetching customer IDs:", error);
    return [];
  }
}

export async function fetchAccountantIds() {
  try {
    const accountantData = await makeApiGetRequest("/api/v1/accountants");
    const ids = accountantData.map((accountant) => accountant.id);
    return ids;
  } catch (error) {
    console.error("Error fetching accountant IDs:", error);
    return [];
  }
}
