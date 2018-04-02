import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import * as SimpleMDE from 'simplemde';

import {Seed} from '../seed/seed.component';
import Random from '../util/random';

@Component({
	selector: 'app-edit-dialog',
	templateUrl: './edit-dialog.component.html',
	styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialog implements OnInit, AfterViewInit {
	@ViewChild('markdownEditor') simpleMDEElement: ElementRef;

	markdownEditor: SimpleMDE; // md 编辑器

	sizes = ['normal', 'large',];

	seed: Seed;

	constructor(public dialogRef: MatDialogRef<EditDialog>,
	            @Inject(MAT_DIALOG_DATA) public data?: Seed) {
		if (data != null) {
			this.seed = Object.assign({}, data);
		} else {
			this.seed = {
				size: 'normal',
				createTime: new Date().toISOString(),
				id: Random.genHash()
			} as Seed;
		}
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			// 初始化 markdown 编辑器
			this.markdownEditor = new SimpleMDE({
				element: this.simpleMDEElement.nativeElement,
				// showIcons: ["code", "table"]
			});

			// 编辑器监听
			this.markdownEditor.codemirror.on('change', () => {
				this.seed.content = this.markdownEditor.value();
			});

			this.markdownEditor.value(this.seed.content);
		}, 100);
	}

	onPublishClick() {
		this.dialogRef.close(this.seed);
	}

	onCancelClick() {
		this.dialogRef.close();
	}

	get isSeedAvailable(): boolean {
		const isNotEmpty = (text) => {
			return typeof text != 'undefined' && text;
		};

		return isNotEmpty(this.seed.img)
			&& isNotEmpty(this.seed.createTime)
			&& isNotEmpty(this.seed.id)
			&& isNotEmpty(this.seed.title)
			&& isNotEmpty(this.seed.subTitle)
			&& isNotEmpty(this.seed.size)
			&& isNotEmpty(this.seed.content);
	}
}