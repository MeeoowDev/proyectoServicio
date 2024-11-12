import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Dialogo1Component } from '../dialogo1/dialogo1.component';
import { RouterModule } from '@angular/router';
import { AudioService } from '../audio.service';

@Component({
  selector: 'app-nivel1',
  standalone: true,
  imports: [CommonModule, Dialogo1Component, RouterModule],
  templateUrl: './nivel1.component.html',
  styleUrls: ['./nivel1.component.css']
})
export class Nivel1Component {
  images = [
    { src: 'assets/0.png', id: '1', container: '', on: false },
    { src: 'assets/1.png', id: '2', container: '', on: false },
    { src: 'assets/2.png', id: '3', container: '', on: false }
  ];
  message: string = '';
  vidas: number = 3;
  progress: number = 0;
  contenedores: number[] = [1, 2, 3];
  randomizedImages: any[] = [];
  randomizedContainers: number[] = [];
  win: boolean = false;
  galloImagen: string = 'assets/normal.png';
  mostrarDialogo: boolean = true;

  constructor(private audioService: AudioService) {
    this.reset();
  }

  ocultarDialogo(): void {
    this.mostrarDialogo = false;
  }

  randomizeOrder() {
    this.randomizedImages = [...this.images].sort(() => Math.random() - 0.5);
    this.randomizedContainers = [...this.contenedores].sort(() => Math.random() - 0.5);
    console.log("Orden de imágenes:", this.randomizedImages.map(img => img.src));
    console.log("Orden de contenedores:", this.randomizedContainers);
  }

  setValues() {
    for (let i = 0; i < this.randomizedImages.length; i++) {
      this.randomizedImages[i].container = `container${this.contenedores[i]}`;
    }
  }

  reset() {
    this.vidas = 3;
    this.progress = 0;
    this.win = false;
    this.message = '';
    this.images.forEach(img => {
      img.on = false;
      img.container = '';
    });
    this.randomizeOrder();
    this.setValues();
  }

  onDragStart(event: DragEvent, imageId: string) {
    event.dataTransfer?.setData('text/plain', imageId);
  }

  onDrop(event: DragEvent, containerId: string) {
    event.preventDefault();
    const imageId = event.dataTransfer?.getData('text');

    if (imageId) {
      const image = this.randomizedImages.find(img => img.id === imageId);

      if (image && !image.on) {
        if (image.container === containerId) {
          image.on = true;
          this.progress++;
          if (this.progress < this.randomizedImages.length) {
            this.message = `¡Bien hecho, sigue así!`;
            this.galloImagen = 'assets/happy.png';
            this.audioService.playSound('assets/sounds/yay.mp3');
            setTimeout(() => {
              this.galloImagen = 'assets/normal.png';
            }, 1000);
          } else {
            this.win = true;
            this.completeLevel();
            this.audioService.playSound('assets/sounds/yay.mp3');
            this.galloImagen = 'assets/happy.png'
          }
        } else {
          this.message = `Oh no, la imagen no va en ese contenedor.`;
          this.vidas--;
          this.audioService.playSound('assets/sounds/hit.mp3');
          this.galloImagen = 'assets/sad.png';
          setTimeout(() => {
            this.galloImagen = 'assets/normal.png';
          }, 1000);
          if (this.vidas === 0) {
            this.message = `Vuelve a intentarlo.`;
          }
        }
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

completeLevel(): void {
  localStorage.setItem('currentLevel', "2");
}

}
