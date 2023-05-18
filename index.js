const contacts = require('./contacts');
const { Command } = require('commander');

const program = new Command();
program
  .option('-a, --action <type>', 'choose action')
  .option('-i, --id <type>', 'user id')
  .option('-n, --name <type>', 'user name')
  .option('-e, --email <type>', 'user email')
  .option('-p, --phone <type>', 'user phone');

program.parse(process.argv);

const argv = program.opts();

// TODO: рефакторить
async function invokeAction({ action, id, name, email, phone }) {
  let result = null;
  switch (action) {
    case 'list':
      result = await contacts.listContacts();
      console.table(result);
      break;

    case 'get':
      if (id) {
        result = await contacts.getContactById(id);
        console.table(result || `\x1B[31mContact with id = ${id}  not found`);
      } else console.warn('\033[94mUse command: node index --action|-a get -i|--id <id>');
      break;

    case 'add':
      if (name && email && phone) {
        result = await contacts.addContact(name, email, phone);
        console.log('Contact added.');
        console.table(result);
      } else
        console.warn(
          '\x1B[31mNot all parameters are specified.\n\033[94m Use command: node index --action|-a add -n|--name <user name> -e|--email <user email> -p|--phone <user phone>'
        );
      break;

    case 'remove':
      if (id) {
        result = await contacts.removeContact(id);
        if (result) {
          console.log(`The contact with id=${id} was removed`);
          console.table(result);
        } else console.warn(`\x1B[31mContact with id = ${id} not found`);
      } else console.info('\033[94mUse command: node index --action|-a remove -i|--id <id>');
      break;

    default:
      console.warn('\x1B[31mUnknown action type!');
      console.log(
        `Use node index --action|-a <command>\nCommands:\nlist\nget -i|--id <id>\nadd -n|--name <user name> -e|--email <user email> -p|--phone <user phone>\nremove -i|--id <id>`
      );
  }
}

invokeAction(argv);
