import {
  Directive,
  effect,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthService } from '../../core/auth-service.service';

@Directive({
  selector: '[appIfUserIsAdmin]',
  standalone: true,
})
export class IfUserIsAdminDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {
    effect(() => {
      // runs whenever one or more of its dependencies (signals or computed signals) change.
      this.viewContainer.clear();
      if (this.authService.isAdmin()) {
        this.viewContainer.createEmbeddedView(this.templateRef); // this.templateref reference to behind the scene created ng-template
      }
      console.log('isAdmin?', this.authService.isAdmin());
    });
  }
}
