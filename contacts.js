const fs = require('fs').promises;
const { log, clear } = require('console');
const { nanoid } = require('nanoid');
const path = require('path');

const contactsPath = path.format({ root: './', dir: 'db', base: 'contacts.json' });

// TODO: задокументировать каждую функцию
async function listContacts() {
  const data = await fs.readFile(contactsPath);
  const result = JSON.parse(data);
  return result || null;
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId);
  let contact = null;
  if (index >= 0) contact = { ...contacts[index] };
  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id === contactId.toString());
  let contact = null;
  if (index >= 0) {
    contact = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, 0, 2));
  }
  return contact;
}

async function addContact(name, email, phone) {
  let contacts = await listContacts();
  const contact = { id: nanoid(), name, email, phone };
  contacts = [...contacts, contact];
  await fs.writeFile(contactsPath, JSON.stringify(contacts, 0, 2));
  return contact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
