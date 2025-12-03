import { Component, OnInit } from '@angular/core';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';
import { SseService } from 'app/services/sse.servece';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cob11',
  templateUrl: './cob11.component.html',
  styleUrls: ['./cob11.component.scss'],
  standalone: true,
  imports: [ProjectCommonModule],
})
export class Cob11Component implements OnInit {
  cogasflow_res = {
    FT0600F003_C: 0,
    COGASMAKEPRESSURE: 0,
    COB10_GASMAKEF: 0,
    COB10_COGSUPPLY: 0,
    COFLARESTACKFLOW: 0,
    COFLARESTACKPRESSURE: 0,
    CO_GAS1_F: 0,
    CO_GAS2_F: 0,
    PBS_BCOGF: 0,
    BF_COF: 0,
    SP_CO_GAS: 0,
    COG_FLOW_GMS: 0,
  };
  boosterValue = {
    AGBS_inletP_b1: 0,
    AGBS_inletP_b2: 0,
    AGBS_outletF: 0,
    AGBS_outletP_b1: 0,
    AGBS_outletP_b2: 0,
    CGBS_inletP_b1: 0,
    CGBS_inletP_b2: 0,
    CGBS_outletF_b1: 0,
    CGBS_outletF_b2: 0,
    CGBS_outletP_b1: 0,
    CGBS_outletP_b2: 0,
  };
  previousValues: any = { ...this.cogasflow_res };
  previousboosterValues: any = { ...this.boosterValue };


  private sseoverview?: Subscription;
  private ssebooster?: Subscription;

  constructor(private sseService: SseService) { }

  splitLetters(text: string): string[] {
    return text.split('').map((c) => (c === ' ' ? '\u00A0' : c));
  }

  animateValue(
    start: number,
    end: number,
    duration: number,
    callback: (val: number) => void,
    decimals: number = 0
  ) {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = start + (end - start) * progress;

      // keep decimals
      const formattedValue = parseFloat(value.toFixed(decimals));
      callback(formattedValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  ngOnInit(): void {
    this.sseoverview = this.sseService.getOverview().subscribe((data: any) => {
      // console.log('es', data);
      // console.log(this.bf5_res);

      // Animate each property
      //sourav code
      this.animateValue(
        this.previousValues.FT0600F003_C,
        data.FT0600F003_C,
        800,
        (val) => (this.cogasflow_res.FT0600F003_C = val)
      );


      this.animateValue(
        this.previousValues.COGASMAKEPRESSURE,
        data.COGASMAKEPRESSURE,
        800, // ms
        (val) => (this.cogasflow_res.COGASMAKEPRESSURE = val)
      );

      this.animateValue(
        this.previousValues.COB10_GASMAKEF,
        data.COB10_GASMAKEF,
        800,
        (val) => (this.cogasflow_res.COB10_GASMAKEF = val)
      );

      // repeat for other props
      this.animateValue(
        this.previousValues.COB10_COGSUPPLY,
        data.COB10_COGSUPPLY,
        800,
        (val) => (this.cogasflow_res.COB10_COGSUPPLY = val)
      );

      this.animateValue(
        this.previousValues.COFLARESTACKFLOW,
        data.COFLARESTACKFLOW,
        800,
        (val) => (this.cogasflow_res.COFLARESTACKFLOW = val)
      );


      this.animateValue(
        this.previousValues.COFLARESTACKPRESSURE,
        data.COFLARESTACKPRESSURE,
        800,
        (val) => (this.cogasflow_res.COFLARESTACKPRESSURE = val)
      );
      //sourav code

      this.animateValue(
        this.previousValues.CO_GAS1_F,
        data.CO_GAS1_F,
        800, // ms
        (val) => (this.cogasflow_res.CO_GAS1_F = val)
      );

      this.animateValue(
        this.previousValues.CO_GAS2_F,
        data.CO_GAS2_F,
        800,
        (val) => (this.cogasflow_res.CO_GAS2_F = val)
      );

      // repeat for other props
      this.animateValue(
        this.previousValues.PBS_BCOGF,
        data.PBS_BCOGF,
        800,
        (val) => (this.cogasflow_res.PBS_BCOGF = val)
      );

      this.animateValue(
        this.previousValues.BF_COF,
        data.BF_COF,
        800,
        (val) => (this.cogasflow_res.BF_COF = val)
      );

      this.animateValue(
        this.previousValues.SP_CO_GAS,
        data.SP_CO_GAS,
        800,
        (val) => (this.cogasflow_res.SP_CO_GAS = val)
      );

      this.animateValue(
        this.previousValues.COG_FLOW_GMS,
        data.COG_FLOW_GMS,
        800, // ms
        (val) => (this.cogasflow_res.COG_FLOW_GMS = val)
      );

      // Update previous values for next round
      this.previousValues = { ...data };
    });

    this.ssebooster = this.sseService.getBooster().subscribe((data: any) => {
      // console.log('es', data);
      // console.log(this.bf5_res);

      // Animate each property
      //sourav code
      this.animateValue(
        this.previousboosterValues.AGBS_inletP_b1,
        data.AGBS_inletP_b1,
        800,
        (val) => (this.boosterValue.AGBS_inletP_b1 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.AGBS_inletP_b2,
        data.AGBS_inletP_b2,
        800, // ms
        (val) => (this.boosterValue.AGBS_inletP_b2 = val)
      );

      this.animateValue(
        this.previousboosterValues.AGBS_outletF,
        data.AGBS_outletF,
        800,
        (val) => (this.boosterValue.AGBS_outletF = val),
        2
      );

      // repeat for other props
      this.animateValue(
        this.previousboosterValues.AGBS_outletP_b1,
        data.AGBS_outletP_b1,
        800,
        (val) => (this.boosterValue.AGBS_outletP_b1 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.AGBS_outletP_b2,
        data.AGBS_outletP_b2,
        800,
        (val) => (this.boosterValue.AGBS_outletP_b2 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.CGBS_inletP_b1,
        data.CGBS_inletP_b1,
        800,
        (val) => (this.boosterValue.CGBS_inletP_b1 = val),
        2
      );
      //sourav code

      this.animateValue(
        this.previousboosterValues.CGBS_inletP_b2,
        data.CGBS_inletP_b2,
        800, // ms
        (val) => (this.boosterValue.CGBS_inletP_b2 = val)
      );

      this.animateValue(
        this.previousboosterValues.CGBS_outletF_b1,
        data.CGBS_outletF_b1,
        800,
        (val) => (this.boosterValue.CGBS_outletF_b1 = val),
        2
      );

      // repeat for other props
      this.animateValue(
        this.previousboosterValues.CGBS_outletF_b2,
        data.CGBS_outletF_b2,
        800,
        (val) => (this.boosterValue.CGBS_outletF_b2 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.CGBS_outletP_b1,
        data.CGBS_outletP_b1,
        800,
        (val) => (this.boosterValue.CGBS_outletP_b1 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.CGBS_outletP_b2,
        data.CGBS_outletP_b2,
        800,
        (val) => (this.boosterValue.CGBS_outletP_b2 = val),
        2
      );

      // Update previous values for next round
      this.previousboosterValues = { ...data };
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.sseoverview) {
      this.sseoverview.unsubscribe();
    }
    if (this.ssebooster) {
      this.ssebooster.unsubscribe();
    }
  }

}
