import { Component, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ModalDirective } from "ngx-bootstrap/modal";
import { AuthentificationService } from "src/app/services/authentification.service";
import { HashtagColorPipePipe } from "../../pipe/hashtag-color-pipe.pipe";
import { PublicationService } from "../../services/publication.service";
import { debounceTime } from "rxjs/operators";
import { LoggedInUserService } from "src/app/services/logged-in-user.service";

interface Image {
  name: string;
  file: File;
  url: SafeUrl;
}
@Component({
  selector: 'app-add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.scss']
})
export class AddProjectModalComponent implements OnInit {

  @ViewChild("myModal") myModal: ModalDirective;
  @ViewChild("myModal2") myModal2: ModalDirective;
  images: Image[] = [];
  postText: any;
  hashtags = [];
  filteredHashtags: any[] = [];
  isModalVisible = true;
  invalide = false;
  isCopyrightChecked: boolean = false;
  postTextElement: HTMLElement | null;
  idUser: any;
  loggedInUser: any;
  tabbleau = ["maha"];

  inputValue: string = "";
  constructor(
    private sanitizer: DomSanitizer,

    private loggedUserServ: LoggedInUserService,
    private publicationService: PublicationService
  ) {
    this.idUser = this.loggedUserServ.getUserID();
  }

  ngOnInit(): void {
    this.loggedUserServ.findUserById(this.idUser).subscribe((res) => {
      this.loggedInUser = res;
    });

    console.log("test maha 2", this.idUser);

    this.getHashtag();
    this.postTextElement = document.querySelector(".form-control.inputtag");
  }

  getHashtag() {
    this.publicationService.getMyHashtag().subscribe((data) => {
      this.hashtags = data;
    });
  }

 

  onFileSelected(event: any): void {
    event.preventDefault(); // empêche le rafraîchissement de la page
    const files = event.target.files;
    for (const file of files) {
      const url = URL.createObjectURL(file);
      const safeUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      const image: Image = {
        name: file.name,
        file: file,
        url: safeUrl,
      };
      this.images.push(image);
    }
    console.log(this.images);
  }

  clearSelectedImage(index: any) {
    this.images.splice(index, 1);
  }




  // hashtag manuplation

  addHashtagg() {
    console.log("value", this.inputValue);

    console.log("index", this.tabbleau.indexOf(this.inputValue));

    if (this.tabbleau.indexOf(this.inputValue) === -1) {
      this.tabbleau.push(this.inputValue);
    }

    console.log(this.tabbleau);
   
  }

  removeHashtag(hash: string) {
    const index = this.tabbleau.indexOf(hash);
    console.log("innnddd", index);

    if (index !== -1) {
      this.tabbleau.splice(index, 1);
    }
  }

  displayValue(value : any){
    console.log("value 2", value );
  }
















  onSubmit() {
    const postText = this.postTextElement.textContent || "";
    if (postText.trim() === "") {
      this.invalide = true;

      return;
    }

    const hashtags = postText.match(/#(\w+)/g) || [];
    const uniqueHashtags = Array.from(
      new Set(hashtags.map((tag) => tag.slice(1)))
    );

    const formData = new FormData();

    formData.append("text", postText);
    formData.append("Id_user", this.idUser);
    formData.append("copyrightChecked", this.isCopyrightChecked.toString());

    if (uniqueHashtags.length === 1) {
      formData.append("hashtags", uniqueHashtags[0]);
    } else {
      uniqueHashtags.forEach((tag) => {
        formData.append("hashtags", tag);
      });
    }

    this.images.forEach((image) => formData.append("images", image.file));

    // send API request to create the new post
    this.publicationService.createPost(formData).subscribe(
      (response) => {
        console.log("ok", response);
        // handle response from the API
        this.postTextElement.innerHTML = "";
        this.images = [];
        this.myModal.hide();
        this.myModal2.show();
      },
      (error) => {
        console.error("err", error);
        // handle error from the API
      }
    );
  }

  


 
 
  
}

 