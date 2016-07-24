import 'reflect-metadata';
import {Component} from '@angular/core';
import {FormBuilder, ControlGroup, Validators, Control} from '@angular/common';
import {Accounts} from '../../../collections/accounts.ts';
import {web3} from "../../lib/eth_init";
import {Meteor} from 'meteor/meteor';

import template from './accounts-form.html';

@Component({
    selector: 'accounts-form',
    template
})
export class AccountsForm {
    accountsForm: ControlGroup;

    constructor() {
        let fb = new FormBuilder();

        this.accountsForm = fb.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            eth_password: ['', Validators.required]
        });
    }

    addAccount(account) {
        if(this.accountsForm.valid) {
            let self = this;
            web3.personal.newAccount(account.eth_password, function(error, result) {
                if(!error){
                    Accounts.insert({
                        name: account.name,
                        email: account.email,
                        password: account.password,
                        eth_address: result,
                    });
                    (<Control>self.accountsForm.controls['name']).updateValue('');
                    (<Control>self.accountsForm.controls['email']).updateValue('');
                    (<Control>self.accountsForm.controls['password']).updateValue('');
                    (<Control>self.accountsForm.controls['eth_password']).updateValue('');

                }
                else{
                    alert("Unable to create account. Please try again!");
                }
            });


        }
    }
}